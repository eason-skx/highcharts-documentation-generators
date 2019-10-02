/*!*
 *
 *  Copyright (C) Highsoft AS
 *
 * */

import * as M from './Members/index';
import Project from './Project';
import TS from 'typescript';

export class MembersUtilities {

    /* *
     *
     *  Static Functions
     *
     * */

    public static loadFromArguments(args: Array<string>): Project {

        const parsedCommandLine = TS.parseCommandLine(args);

        return new Project(
            TS.createProgram(
                parsedCommandLine.fileNames,
                parsedCommandLine.options
            )
        );
    }

    public static loadFromDirectory(directoryPath: string): Project {

        const tsConfig = TS.readJsonConfigFile(
            TS.sys.resolvePath(directoryPath),
            TS.sys.readFile
        );

        const parsedCommandLine = TS.parseJsonConfigFileContent(
            tsConfig,
            TS.sys,
            directoryPath
        );

        const project = new Project(
            TS.createProgram(
                parsedCommandLine.fileNames,
                parsedCommandLine.options
            )
        );

        project.directoryPath = directoryPath;

        return project;
    }

    public static loadFromNode(node: TS.Node): M.Member {

        if (TS.isBundle(node)) {
            return new M.BundleMember(node);
        }

        if (TS.isSourceFile(node)) {
            return new M.FileMember(node);
        }

        if (TS.isModuleDeclaration(node)) {
            return new M.ModuleMember(node);
        }

        if (TS.isExportAssignment(node) || TS.isExportDeclaration(node)) {
            return new M.ExportMember(node);
        }

        if (TS.isBlock(node) || TS.isModuleBlock(node)) {
            return new M.BlockMember(node);
        }

        return new M.Member(node);
    }
}

export default MembersUtilities;