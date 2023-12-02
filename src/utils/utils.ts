import * as bcrypt from 'bcrypt';

export async function getHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}
