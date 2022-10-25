
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should not be able to authenticate user if incorrect email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Alexandre",
        email: "alexandre@gmail.com",
        password: "ilovekira",
      });

      await authenticateUserUseCase.execute({
        email: "alexandre2@gmail.com",
        password: "ilovekira",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate user if incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Alexandre",
        email: "alexandre@gmail.com",
        password: "ilovekira",
      });

      await authenticateUserUseCase.execute({
        email: "alexandre@gmail.com",
        password: "ilovekira2",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      name: "Alexandre3",
      email: "alexandre3@gmail.com",
      password: "ilovekira3",
    });

    const authentication = await authenticateUserUseCase.execute({
      email: "alexandre3@gmail.com",
      password: "ilovekira3",
    });

    expect(authentication).toHaveProperty("user.id");
    expect(authentication).toHaveProperty("user.name");
    expect(authentication).toHaveProperty("user.id");
    expect(authentication).toHaveProperty("token");
  });
});
