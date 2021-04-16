import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppErrors } from "@shared/errors/AppErrors";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;

describe("Send forgot mail", ()=>{
    beforeEach(()=>{
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
        mailProviderInMemory = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokenRepositoryInMemory,
            dateProvider,
            mailProviderInMemory
        );
    });
    
    it("should be able to a email to reset password", async()=>{
        const sendMail = spyOn(mailProviderInMemory, "sendMail");

        await usersRepositoryInMemory.create({
            driver_license: "1234ABS",
            email: "email@test.com",
            name: "Romild claudio",
            password: "51423"
        });

        await sendForgotPasswordMailUseCase.execute("email@test.com");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send an email if user does not exists", async ()=>{
        await expect(
            sendForgotPasswordMailUseCase.execute("zeijo12@test.com")
        ).rejects.toEqual(new AppErrors("User does not exists"))
    });

    it("should be able to create an users token", async ()=>{
        const generateToken = spyOn(usersTokenRepositoryInMemory, "create");
        
        usersRepositoryInMemory.create({
            driver_license: "412312",
            email: "another@email.com",
            name: "Hipocrates da silva",
            password: "5151232"
        });

        await sendForgotPasswordMailUseCase.execute("another@email.com");

        expect(generateToken).toBeCalled();
    })
});