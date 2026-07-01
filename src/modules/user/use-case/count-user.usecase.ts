export const countUserUseCase = async (users: Array<any>) => {
    if (!users) {
        return 'No users found';
    }

    return users.length;
}