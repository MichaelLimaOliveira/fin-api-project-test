
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateStatementUseCase } from "@modules/statements/useCases/createStatement/CreateStatementUseCase"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from"@modules/statements/useCases/createStatement/CreateStatementError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository : InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statement", () => {
  beforeEach(()=> {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should not be able to create statement a non exists user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Alexandre3",
        email: "alexandre@gmail.com",
        password: "ilovekira",
      });

      await authenticateUserUseCase.execute({
        email: "alexandre@gmail.com",
        password: "ilovekira",
      });

      const type = "deposit" as OperationType;
      await createStatementUseCase.execute({
        user_id: "false id",
        type,
        amount: 100,
        description: "teste",
      });

    }).rejects;
  });

  it("Should not be possible to withdraw if the balance is less than the withdrawal amount", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Alexandre2",
        email: "alexandre@gmail2.com",
        password: "ilovekira2",
      });

      await authenticateUserUseCase.execute({
        email: "alexandre@gmail2.com",
        password: "ilovekira2",
      });

      const type = "withdraw" as OperationType;
      await createStatementUseCase.execute({
        user_id: user.id,
        type,
        amount: 100,
        description: "teste",
      });
    }).rejects;
  });

  it("Should be able to deposit value", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre4",
      email: "alexandre@gmail4.com",
      password: "ilovekira4",
    });

    const depositStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    expect(depositStatement.amount).toEqual(100);
  });

  it("Should be able to make withdraw if have funds", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre3",
      email: "alexandre@gmail3.com",
      password: "ilovekira3",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    const withdrawStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: 50,
      description: "teste2",
    })

    expect(withdrawStatement.amount).toEqual(50);
  });
});
