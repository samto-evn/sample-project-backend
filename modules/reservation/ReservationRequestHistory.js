const { ObjectId } = require('mongodb');

class ReservationRequestHistory {
  constructor(id) {
    this.data = {
      id,
      source : null,
      cleverSenderId: null,
      zaloRecipientId: null,
      zaloMessageId: null,
      zaloSenderId: null,
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

  get zaloRecipientId() {
    return this.data.zaloRecipientId;
  }

  set zaloRecipientId(value) {
    this.data.zaloRecipientId = value;
  }

  get zaloSenderId() {
    return this.data.zaloSenderId;
  }

  set zaloSenderId(value) {
    this.data.zaloSenderId = value;
  }

  get cleverSenderId() {
    return this.data.cleverSenderId;
  }

  set cleverSenderId(value) {
    this.data.cleverSenderId = value;
  }

  get timestamp() {
    return this.data.senderId;
  }

  set zaloMessageId(value) {
    this.data.zaloMessageId = value;
  }

  get zaloMessageId() {
    return this.data.zaloMessageId;
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
