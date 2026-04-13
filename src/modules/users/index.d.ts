export type UserEntity = {
  id: string;
  userId: string;
  name: string;
  email: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

// export type CreateUserDTO = Pick<UserEntity, "userId" | "name" | "email"> & { password: string };
// export type UpdateUserDTO = Partial<Omit<UserEntity, "id" | "createdAt" | "updatedAt"> & { password: string }>;
// export type UpdateUserPermissionsDTO = {
//   add: UserEntity["permissions"];
//   remove: UserEntity["permissions"];
// };
// export type FindUsersQueryDTO = Partial<Pick<UserEntity, "userId" | "name" | "email">>;
export type { CreateUserDTO, FindUsersQueryDTO, UpdateUserInfoDTO, UpdateUserPermissionsDTO } from "./users.dto.js";

// Users 모듈이 외부에 제공하는 퍼블릭 서비스 인터페이스 (선택)
export type UsersPublicService = {
  findUserById(id: string): Promise<UserEntity | null>;
};
