import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Booking Types
  type Booking = {
    fullName : Text;
    phoneNumber : Text;
    email : Text;
    numberOfGuests : Nat;
    date : Text;
    timeSlot : Text;
    specialRequest : Text;
    timestamp : Int;
    status : BookingStatus;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  // Review Types
  type Review = {
    name : Text;
    rating : Nat;
    reviewText : Text;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let bookings = Map.empty<Nat, Booking>();
  let reviews = Map.empty<Text, Review>();

  var nextBookingId = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Booking Functions
  public shared ({ caller }) func submitBooking(booking : Booking) : async Nat {
    let newBooking : Booking = {
      booking with
      timestamp = Time.now();
      status = #pending;
    };

    bookings.add(nextBookingId, newBooking);
    let currentId = nextBookingId;
    nextBookingId += 1;
    currentId;
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin can update booking status");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          booking with
          status;
        };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admin can view all bookings");
    };
    bookings.values().toArray();
  };

  // Review Functions
  public shared ({ caller }) func submitReview(name : Text, rating : Nat, reviewText : Text) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let newReview : Review = {
      name;
      rating;
      reviewText;
    };

    reviews.add(name, newReview);
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.values().toArray();
  };
};
