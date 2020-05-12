class ReservationRequestHistory {
  constructor(id) {
    this.data = {
      id,
      source : null,
      recipientId: null,
      senderId: null,
      timestamp: null,
      payload: {}
    }
  }

  get id() {
    return this.data.id;
  }

  set id(value) {
    this.data.id = value;
  }

  get source() {
    return this.data.source;
  }

  set source(value) {
    this.data.source = value;
  }

  get recipientId() {
    return this.data.recipientId;
  }

  set recipientId(value) {
    this.data.recipientId = value;
  }

  get senderId() {
    return this.data.senderId;
  }

  set senderId(value) {
    this.data.senderId = value;
  }

  get timestamp() {
    return this.data.senderId;
  }

  set timestamp(value) {
    this.data.timestamp = value;
  }

  get payload() {
    return this.data.payload;
  }

  set payload(value) {
    this.data.payload = value;
  }

  toJson() {
    return this.data;
  }
}

module.exports = ReservationRequestHistory;