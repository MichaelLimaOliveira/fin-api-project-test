import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show authenticate user", () => {
  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it("Should not be able to show a not authenticate user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("false_id")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("Should be able to show authenticate user", async () => {
    await createUserUseCase.execute({
      name: "Alexandre3",
      email: "alexandre3@gmail.com",
      password: "ilovekira3",
    });

    const authentication = await authenticateUserUseCase.execute({
      email: "alexandre3@gmail.com",
      password: "ilovekira3",
    });

    const user = await showUserProfileUseCase.execute(authentication.user.id)

    expect(user.id).toEqual(authentication.user.id);
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("password");
  });
});
