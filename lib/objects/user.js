// + id:ObjectId
// + scenario:ObjectId(Scenario)
// + configuration:ObjectId(Configuration)
// - starttimestamp:Long
// - updatetimestamp:Long
// + user:ObjectId(User)
// - state:String // pending,running,acked, cancelled, finished
// - status:String // succeeded, inconclusive, partial, failed
// - ok:Long,
// - partial:Long,
// - inconclusive:Long
// - failed:Long,
// - nbstatuses:Long // sum(ok, partial...)
// - done:Boolean

'use strict';

class User {
  constructor(data) {
    this.id = data.id;
    this.first = data.first;
    this.last = data.last;
    this.email = data.email;
    this.uid = data.uid;
  }

  toJSON() {
    return {
      id: this.id,
      first: this.first,
      last: this.last,
      email: this.email,
      uid: this.uid,
    };
  }
}

module.exports = User;
