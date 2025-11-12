import { actions, Sync } from "@engine";
import { FileUploading, Sharing } from "@concepts";

/**
 * @sync CascadeFileDeletion
 * @description When a file is deleted in FileUploading, automatically clean up
 *              all sharing relationships for that file in the Sharing concept.
 *              This prevents orphaned sharing records.
 */
export const CascadeFileDeletion: Sync = ({ file }) => ({
  when: actions([FileUploading.delete, { file }, {}]),
  then: actions([Sharing.deleteFile, { file }]),
});

