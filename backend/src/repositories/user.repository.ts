import { UserModel, UserDocument } from "../models/user.model";

// The repository is the only layer that talks to the User model directly.
export class UserRepository {
  findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findByUsername(username: string): Promise<UserDocument | null> {
    return UserModel.findOne({ username }).exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  // Used during password change where the hash must be loaded explicitly,
  // since the schema hides it by default.
  findByIdWithPassword(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).select("+password").exec();
  }

  create(data: Partial<UserDocument>): Promise<UserDocument> {
    return UserModel.create(data);
  }

  update(id: string, data: Partial<UserDocument>): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}

export const userRepository = new UserRepository();
