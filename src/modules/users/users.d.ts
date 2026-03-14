declare namespace UserModule {
  import type {
    Document,
    Schema,
    Model,
    HydratedDocument,
    ProjectionType,
    QueryOptions,
    ObjectId,
    FilterQuery,
  } from "mongoose";

  type User = {
    id: string;
    uid: string;
    userId: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    permissions: string[];
  };

  // Repository
  interface UserRepository {
    createUser(data: CreateUserDTO): Promise<User>;
    findUsers(
      filter: ObjectId | FilterQuery<User>,
      projection?: ProjectionType<User> | null,
      options?: QueryOptions<User> | null,
    ): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    updateUserById(
      id: string,
      data: Pratial<User>,
    ): Promise<{
      old?: User | null;
      new?: User | null;
    }>;
    deleteUserById(id: string): Promise<User | null>;
  }
  type UserSchema = Schema<User>;
  type UserModel = Model<User>;
  type UserDocument = HydratedDocument<User>;

  // Controller
  interface UserController {
    createUser(options: {
      service: ReturnType<UserService["createUser"]>;
    }): APIRequestHandler<CommonUserResponse, CreateUserDTO, null, null>;
    findUsers(options: {
      service: ReturnType<UserService["findUsers"]>;
    }): APIRequestHandler<CommonUserResponse[], null, FindUsersDTO, null>;
    userProfile(options: {
      service: ReturnType<UserService["findUserByUid"]>;
    }): APIRequestHandler<CommonUserResponse, null, null, UidParams>;
    updateUserInfo(options: {
      service: ReturnType<UserService["updateUserInfo"]>;
    }): APIRequestHandler<CommonUserResponse, UpdateUserInfoDTO, null, UidParams>;
    updateUserPermissions(options: {
      service: ReturnType<UserService["updateUserPermissions"]>;
    }): APIRequestHandler<CommonUserResponse, UpdateUserPermissionsDTO, null, UidParams>;
    deleteUser(options: {
      service: ReturnType<UserService["deleteUser"]>;
    }): APIRequestHandler<CommonUserResponse, null, null, UidParams>;
  }

  // Service
  interface UserService {
    createUser(options: { repository: UserRepository }): (data: CreateUserDTO) => Promise<CommonUserResponse | null>;
    findUsers(options: { repository: UserRepository }): (filter: FindUsersDTO) => Promise<CommonUserResponse[]>;
    findUserByUid(options: { repository: UserRepository }): (uid: User["uid"]) => Promise<CommonUserResponse | null>;
    updateUserInfo(options: {
      repository: UserRepository;
    }): (
      uid: User["uid"],
      data: UpdateUserInfoDTO,
    ) => Promise<{ old?: CommonUserResponse | null; new?: CommonUserResponse | null }>;
    updateUserPermissions(options: {
      repository: UserRepository;
    }): (
      uid: User["uid"],
      permsOperation: UpdateUserPermissionsDTO,
    ) => Promise<{ old?: CommonUserResponse | null; new?: CommonUserResponse | null }>;
    deleteUser(options: { repository: UserRepository }): (uid: User["uid"]) => Promise<CommonUserResponse | null>;
  }
  type CommonUserResponse = Omit<User, "id" | "password" | "createdAt" | "updatedAt">;

  // DTO
  type UserIdParams = Pick<User, "userId">;
  type UidParams = Pick<User, "uid">;
  type CreateUserDTO = Pick<User, "userId" | "name" | "email" | "password">;
  type FindUsersDTO = Partial<{
    userId: string | string[];
    name: string | string[];
    email: string | string[];
    permissions: string | string[];
  }>;
  type UpdateUserInfoDTO = Pick<User, "name" | "email">;
  type UpdateUserPermissionsDTO = {
    add: User["permissions"];
    remove: User["permissions"];
  };
}
