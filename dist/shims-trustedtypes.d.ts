interface TrustedTypesFactory {
    createPolicy(policyName: string, policyOptions?: TrustedTypePolicyOptions): TrustedTypePolicy;
}
interface TrustedTypePolicyOptions {
    createHTML: (input: string, ...args: any[]) => string;
}
interface TrustedHTML {
    toString(): string;
}
interface TrustedTypePolicy {
    createHTML(input: string, ...args: any[]): TrustedHTML | string;
}
declare interface Window {
    trustedTypes?: TrustedTypesFactory;
}
declare let trustedTypes: TrustedTypesFactory;
declare interface HTMLElement {
    innerHTML: string | TrustedHTML;
}
