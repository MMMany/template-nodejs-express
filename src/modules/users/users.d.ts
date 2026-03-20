declare namespace UserModule {
  import type {
    Document,
    Schema,
    Model,
    HydratedDocument,
    ProjectionType,
    QueryOptions,
    ObjectId,
    QueryFilter,
  } from "mongoose";

  type User = {
    id: string; // autogen
    userId: string;
    name: string;
    email: string;
    password: string;
    permissions: string[];
    createdAt: Date; // autogen
    updatedAt: Date; // autogen
  };

  // Types
  type UserIdParams = Pick<User, "userId">;
  type IdParams = Pick<User, "id">;
  type CreateUserDTO = Pick<User, "userId" | "name" | "email" | "password">;
  type FindUsersQuery = Pick<User, "userId" | "name" | "email">;
  type UpdateUserInfoDTO = Pick<User, "name" | "email">;
  type UpdateUserPermissionsDTO = {
    add: User["permissions"];
    remove: User["permissions"];
  };
  type UserResponse = Omit<User, "password">;

  // Repository
  type UserSchema = Schema<User>;
  type UserModel = Model<User>;
  type UserDocument = HydratedDocument<User>;
  interface UserRepository {
    createUser(data: CreateUserDTO): Promise<User | null>;
    findUsers(
      filter: QueryFilter<User>,
      projection?: ProjectionType<User>,
      options?: QueryOptions<User>,
    ): Promise<User[]>;
    findUserById(id: string): Promise<User | null>;
    updateUserById(id: string, data: Pratial<User>): Promise<{ old: User; new: User } | null>;
    deleteUserById(id: string): Promise<User | null>;
  }

  // Service
  type ServiceDeps = { repository: UserRepository };
  interface UserService {
    createUser(deps: ServiceDeps): (data: CreateUserDTO) => Promise<User | null>;
    findUsers(deps: ServiceDeps): (filter: FindUsersQuery) => Promise<User[]>;
    findUserById(deps: ServiceDeps): (id: string) => Promise<User | null>;
    updateUserInfo(deps: {
      repository: UserRepository;
    }): (uid: User["uid"], data: UpdateUserInfoDTO) => Promise<{ old?: User | null; new?: User | null }>;
    updateUserPermissions(deps: {
      repository: UserRepository;
    }): (
      uid: User["uid"],
      permsOperation: UpdateUserPermissionsDTO,
    ) => Promise<{ old?: User | null; new?: User | null }>;
    deleteUser(deps: ServiceDeps): (uid: User["uid"]) => Promise<User | null>;
  }

  // Controller
  type ControllerDeps<T> = { service: ReturnType<T> };
  interface UserController {
    createUser(
      deps: ControllerDeps<UserService["createUser"]>,
    ): APIRequestHandler<UserResponse, CreateUserDTO, null, null>;
    findUsers(
      deps: ControllerDeps<UserService["findUsers"]>,
    ): APIRequestHandler<UserResponse[], null, FindUsersQuery, null>;
    userProfile(
      deps: ControllerDeps<UserService["findUserById"]>,
    ): APIRequestHandler<UserResponse, null, null, IdParams>;
    updateUserInfo(
      deps: ControllerDeps<UserService["updateUserInfo"]>,
    ): APIRequestHandler<UserResponse, UpdateUserInfoDTO, null, IdParams>;
    updateUserPermissions(
      deps: ControllerDeps<UserService["updateUserPermissions"]>,
    ): APIRequestHandler<UserResponse, UpdateUserPermissionsDTO, null, IdParams>;
    deleteUser(deps: ControllerDeps<UserService["deleteUser"]>): APIRequestHandler<UserResponse, null, null, IdParams>;
  }
}
