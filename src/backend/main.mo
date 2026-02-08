import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type TicketStatus = {
    #new;
    #inProgress;
    #waitingForParts;
    #ready;
    #closed;
  };

  public type StatusLog = {
    status : TicketStatus;
    timestamp : Time.Time;
    notes : ?Text;
  };

  public type RepairTicket = {
    id : Nat;
    createdBy : Principal;
    customerName : Text;
    contactInfo : Text;
    deviceBrand : Text;
    deviceModel : Text;
    issueDescription : Text;
    createdAt : Time.Time;
    currentStatus : TicketStatus;
    priceEstimate : ?Float;
    technicianNotes : ?Text;
    statusHistory : [StatusLog];
  };

  // Map to store all tickets
  let tickets = Map.empty<Nat, RepairTicket>();
  var nextTicketId = 0;

  module RepairTicket {
    public func compareByCreatedAt(a : RepairTicket, b : RepairTicket) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  public shared ({ caller }) func createTicket(
    customerName : Text,
    contactInfo : Text,
    deviceBrand : Text,
    deviceModel : Text,
    issueDescription : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tickets");
    };

    let ticketId = nextTicketId;
    nextTicketId += 1;

    let newTicket : RepairTicket = {
      id = ticketId;
      createdBy = caller;
      customerName;
      contactInfo;
      deviceBrand;
      deviceModel;
      issueDescription;
      createdAt = Time.now();
      currentStatus = #new;
      priceEstimate = null;
      technicianNotes = null;
      statusHistory = [{
        status = #new;
        timestamp = Time.now();
        notes = null;
      }];
    };

    tickets.add(ticketId, newTicket);
    ticketId;
  };

  public query ({ caller }) func getMyTickets() : async [RepairTicket] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their tickets");
    };

    tickets.values().toArray().filter(
      func(ticket) {
        ticket.createdBy == caller;
      }
    ).sort(RepairTicket.compareByCreatedAt);
  };

  public query ({ caller }) func getTicketDetails(ticketId : Nat) : async RepairTicket {
    switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?ticket) {
        if (caller != ticket.createdBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins or ticket owner can view this ticket");
        };
        ticket;
      };
    };
  };

  public query ({ caller }) func getAllTickets() : async [RepairTicket] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all tickets");
    };
    tickets.values().toArray();
  };

  public shared ({ caller }) func updateTicketStatus(
    ticketId : Nat,
    newStatus : TicketStatus,
    notes : ?Text,
    priceEstimate : ?Float,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update ticket status");
    };

    switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?ticket) {
        let updatedTicket = {
          ticket with
          currentStatus = newStatus;
          priceEstimate;
          technicianNotes = notes;
          statusHistory = ticket.statusHistory.concat([{
            status = newStatus;
            timestamp = Time.now();
            notes;
          }]);
        };

        tickets.add(ticketId, updatedTicket);
      };
    };
  };
};
