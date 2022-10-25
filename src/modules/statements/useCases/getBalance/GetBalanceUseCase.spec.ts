import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository : InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("List user balance", () => {
  beforeEach(()=> {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    );
  });

  it("Should not be able to get balance with non exists user", async () =>{
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "false id"})
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("Should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre",
      email: "alexandre@gmail.com",
      password: "ilovekira",
    });

    await authenticateUserUseCase.execute({
      email: "alexandre@gmail.com",
      password: "ilovekira",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    const balance = await getBalanceUseCase.execute({user_id: user.id});

    expect(balance.statement.length).toBe(1);
    expect(balance.balance).toEqual(100);
  });
});
