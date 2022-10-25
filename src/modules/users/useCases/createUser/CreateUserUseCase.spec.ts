import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository
describe("Create user", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre",
      email: "alexandre@gmail.com",
      password: "ilovekira",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user with user email exist", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Alexandre",
        email: "alexandre@gmail.com",
        password: "ilovekira",
      });

      await createUserUseCase.execute({
        name: "Estevâo",
        email: "alexandre@gmail.com",
        password: "ilovekirasempai",
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
