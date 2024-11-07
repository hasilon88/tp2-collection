import { UserService } from '../services/user.service';
import RegistrationDTO from '../payloads/dto/register.dto';

test('Add user', async () => {
    const userDto: RegistrationDTO = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "employee"
    };
    const result = await UserService.addUser(userDto);
    expect(result).toBe(true);
});

test('Add user with duplicate email', async () => {
    const userDto: RegistrationDTO = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "employee"
    };
    const result = await UserService.addUser(userDto);
    expect(result).toBe(false);
});

test('Get all users', async () => {
    const users = await UserService.getAllUser();
    expect(users.length).toBeGreaterThanOrEqual(0);
});

test('Get user by email', async () => {
    const user = await UserService.getUserByEmail("john@example.com");
    expect(user).not.toBeNull();
    expect(user?.email).toBe("john@example.com");
});

test('User not found by email', async () => {
    const user = await UserService.getUserByEmail("notfound@example.com");
    expect(user).toBeNull();
});

test('Update user', async () => {
    const updatedData = { name: "John Updated" };
    const result = await UserService.updateUser("john@example.com", updatedData);
    expect(result).toBe(true);
});

test('Update user not found', async () => {
    const updatedData = { name: "Nonexistent User" };
    const result = await UserService.updateUser("notfound@example.com", updatedData);
    expect(result).toBe(false);
});

test('Delete user', async () => {
    const result = await UserService.deleteUser("john@example.com");
    expect(result).toBe(true);
});

test('Delete user not found', async () => {
    const result = await UserService.deleteUser("notfound@example.com");
    expect(result).toBe(false);
});