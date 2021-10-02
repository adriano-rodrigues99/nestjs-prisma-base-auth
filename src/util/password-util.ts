export class PasswordUtils {
  public checkPasswordLength(password: string): boolean {
    const regex: RegExp = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}');
    return regex.test(password);
  }
}
