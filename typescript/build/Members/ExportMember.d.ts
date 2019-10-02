/*!*
 *
 *  Copyright (C) Highsoft AS
 *
 * */
import * as M from './Member';
import TS from 'typescript';
export declare class ExportMember extends M.Member<(TS.ExportAssignment | TS.ExportDeclaration)> {
    toJSON(): ExportMemberJSON;
}
export interface ExportMemberJSON extends M.MemberJSON {
    kind: 'export';
}
export default ExportMember;