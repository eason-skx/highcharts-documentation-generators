"use strict";
/*!*
 *
 *  Copyright (C) Highsoft AS
 *
 * */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MembersUtilities_1 = __importDefault(require("../MembersUtilities"));
const typescript_1 = __importDefault(require("typescript"));
class Member {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(sourceFile, node, isNotSupported = false) {
        this._isSupported = (isNotSupported === false);
        this._node = node;
        this._sourceFile = sourceFile;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    static childrenJSONMapper(child) {
        return child.toJSON();
    }
    get isSupported() {
        return this._isSupported;
    }
    get node() {
        return this._node;
    }
    get sourceFile() {
        return this._sourceFile;
    }
    /* *
     *
     *  Functions
     *
     * */
    getChildNodes() {
        return this.node.getChildren(this.sourceFile);
    }
    getChildren() {
        const sourceFile = this.sourceFile;
        const nodeChildren = this.getChildNodes();
        const memberChildren = [];
        let memberChild;
        for (let nodeChild of nodeChildren) {
            memberChild = MembersUtilities_1.default.loadFromNode(sourceFile, nodeChild);
            if (memberChild.isSupported) {
                memberChildren.push(memberChild);
            }
            else {
                memberChildren.push(...memberChild.getChildren());
            }
        }
        return memberChildren;
    }
    getChildrenJSON() {
        return this
            .getChildren()
            .map(Member.childrenJSONMapper);
    }
    toJSON() {
        const childrenJSON = this.getChildrenJSON();
        const node = this.node;
        return {
            children: childrenJSON.length === 0 ?
                undefined :
                childrenJSON,
            kind: typescript_1.default.SyntaxKind[node.kind],
            kindID: node.kind,
            name: this.toString(),
            unsupportedNode: this.isSupported ?
                undefined :
                node
        };
    }
    toString() {
        return typescript_1.default.getGeneratedNameForNode(this.node).escapedText.toString();
    }
}
exports.Member = Member;
exports.default = Member;
