import * as path from 'node:path';
enum AllowedFileExtensions {
  DOC = '.doc',
  DOCX = '.docx',
  PDF = '.pdf',
  PNG = '.png',
  JPEG = '.jpeg',
  GIF = '.gif',
  MP3 = '.mp3',
  WAV = '.wav',
  MP4 = '.mp4',
  AVI = '.avi',
}
//ext - any, по-хорошему бы типизировать
export function isAllowedExtension(ext) {
  return Object.values(AllowedFileExtensions).includes(
    path.extname(ext) as any,
  );
}
