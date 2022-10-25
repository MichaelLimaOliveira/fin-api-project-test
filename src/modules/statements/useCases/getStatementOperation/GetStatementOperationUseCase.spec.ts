import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository : InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("List user statement", () => {
  beforeEach(() =>{
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should not be able to get statement with a non exists user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "false id",
        statement_id: "false_id"
      });
    }).rejects;
  });

  it("Should be able to get user statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Alexandre",
      email: "alexandre@gmail.com",
      password: "ilovekira",
    });

    await authenticateUserUseCase.execute({
      email: "alexandre@gmail.com",
      password: "ilovekira",
    });


    const userStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "teste",
    });

    const statement = await getStatementOperationUseCase.execute({
      statement_id: userStatement.id,
      user_id: user.id
    });

    expect(user.id).toEqual(statement.user_id);
    expect(userStatement.id).toEqual(statement.id);
  });
});
