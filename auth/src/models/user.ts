import mongoose from "mongoose";
import { Password  } from "../services/password";

//An interface that describe s the properties
//that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

//An interface that describes the properties
//that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
//that a User document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
}
,{
  //这一步是因为MongoDB中的一些键带有下划线_，导致我们开发与数据库的键不一致
  //所以用这个方法可以返回一个新的对象，这样我们可以修改键的名称，删除不想要的键或数据
  toJSON: {
    transform(doc, ret){
      //去掉_id的下划线
      ret.id = ret._id;
      delete ret._id;
      
      delete ret.password;//删除对象中指定的property
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function (done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
  
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// };





export { User };