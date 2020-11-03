import React from "react";
import Wrapper, {WrapperProps, WrapperVariant} from "./Wrapper";

interface LayoutProps {
    variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
    return (
        <>
            <Wrapper sizeProfile={variant}>{children}</Wrapper>
        </>
    );
};
