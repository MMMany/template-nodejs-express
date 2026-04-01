declare namespace UserModule {
  import type { Schema, Model, HydratedDocument, ProjectionType, QueryOptions, QueryFilter } from "mongoose";

  type Entity = {
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
  type UserIdParams = Pick<Entity, "userId">;
  type IdParams = Pick<Entity, "id">;
  type CreateUserDTO = Pick<Entity, "userId" | "name" | "email" | "password">;
  type FindUsersQuery = Pick<Entity, "userId" | "name" | "email">;
  type UpdateUserInfoDTO = Pick<Entity, "name" | "email">;
  type UpdateUserPermissionsDTO = {
    add: Entity["permissions"];
    remove: Entity["permissions"];
  };
  type UserResponse = Omit<Entity, "password">;

  // Repository
  type UserSchema = Schema<Entity>;
  type UserModel = Model<Entity>;
  type UserDocument = HydratedDocument<Entity>;
  type Repository = {
    createUser(data: CreateUserDTO): Promise<Entity | null>;
    findUsers(
      filter: QueryFilter<Entity>,
      projection?: ProjectionType<Entity>,
      options?: QueryOptions<Entity>,
    ): Promise<Entity[]>;
    findUserById(id: string): Promise<Entity | null>;
    updateUserById(id: string, data: Pratial<Entity>): Promise<{ old: Entity; new: Entity } | null>;
    deleteUserById(id: string): Promise<Entity | null>;
  };

  // Service
  type ServiceGenerator = {
    createUser(repository: Repository): (data: CreateUserDTO) => Promise<Entity | null>;
    findUsers(repository: Repository): (filter: FindUsersQuery) => Promise<Entity[]>;
    findUserById(repository: Repository): (id: string) => Promise<Entity | null>;
    updateUserInfo(
      repository: Repository,
    ): (uid: Entity["uid"], data: UpdateUserInfoDTO) => Promise<{ old?: Entity | null; new?: Entity | null }>;
    updateUserPermissions(
      repository: Repository,
    ): (
      uid: Entity["uid"],
      permsOperation: UpdateUserPermissionsDTO,
    ) => Promise<{ old?: Entity | null; new?: Entity | null }>;
    deleteUser(repository: Repository): (uid: Entity["uid"]) => Promise<Entity | null>;
  };
  type Service = {
    createUser: ReturnType<ServiceGenerator["createUser"]>;
    findUsers: ReturnType<ServiceGenerator["findUsers"]>;
    findUserById: ReturnType<ServiceGenerator["findUserById"]>;
    updateUserInfo: ReturnType<ServiceGenerator["updateUserInfo"]>;
    updateUserPermissions: ReturnType<ServiceGenerator["updateUserPermissions"]>;
    deleteUser: ReturnType<ServiceGenerator["deleteUser"]>;
  };
  type ServiceBuilder = (repository: Repository) => Service;

  // Controller
  type ControllerGenerator = {
    createUser(service: Service): APIRequestHandler<null, UserResponse, CreateUserDTO, null>;
    findUsers(service: Service): APIRequestHandler<null, UserResponse[], null, FindUsersQuery>;
    userProfile(service: Service): APIRequestHandler<IdParams, UserResponse, null, null>;
    updateUserInfo(service: Service): APIRequestHandler<IdParams, UserResponse, UpdateUserInfoDTO, null>;
    updateUserPermissions(service: Service): APIRequestHandler<IdParams, UserResponse, UpdateUserPermissionsDTO, null>;
    deleteUser(service: Service): APIRequestHandler<IdParams, UserResponse, null, null>;
  };
  type Controller = {
    createUser: ReturnType<ControllerGenerator["createUser"]>;
    findUsers: ReturnType<ControllerGenerator["findUsers"]>;
    userProfile: ReturnType<ControllerGenerator["userProfile"]>;
    updateUserInfo: ReturnType<ControllerGenerator["updateUserInfo"]>;
    updateUserPermissions: ReturnType<ControllerGenerator["updateUserPermissions"]>;
    deleteUser: ReturnType<ControllerGenerator["deleteUser"]>;
  };
  type ControllerBuilder = (service: Service) => Controller;
}
