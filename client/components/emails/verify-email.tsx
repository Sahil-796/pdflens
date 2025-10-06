import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
} from '@react-email/components';
import Link from 'next/link';

interface EmailVerificationProps {
    userEmail: string;
    emailUrl: string;
}

const EmailVerification = (props: EmailVerificationProps) => {
    const { userEmail, emailUrl } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[24px] font-bold text-gray-900 m-0">
                                Verify Your Email Address
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Hi there,
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Thanks for signing up! To complete your registration and secure your account,
                                please verify your email address by clicking the button below.
                            </Text>
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                                Email: <strong>{userEmail}</strong>
                            </Text>
                        </Section>

                        {/* Verification Button */}
                        <Section className="text-center mb-[32px]">
                            <Button
                                href={emailUrl}
                                className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border"
                            >
                                Verify Email Address
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Section className="mb-[32px]">
                            <Text className="text-[14px] text-gray-600 leading-[20px]">
                                If the button doesn't work, you can copy and paste this link into your browser:
                            </Text>
                            <Text className="text-[14px] text-blue-600 break-all">
                                {emailUrl}
                            </Text>
                        </Section>

                        {/* Security Note */}
                        <Section className="mb-[32px]">
                            <Text className="text-[14px] text-gray-600 leading-[20px]">
                                This verification link will expire in 24 hours for security reasons.
                                If you didn't create an account, you can safely ignore this email.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[24px]" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                © 2025 Your Company Name. All rights reserved.
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                123 Business Street, Suite 100, City, State 12345
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                <Link href="#" className="text-gray-500 underline">Unsubscribe</Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default EmailVerification;