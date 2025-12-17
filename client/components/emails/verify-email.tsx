import * as React from "react";
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
} from "@react-email/components";

interface EmailVerificationProps {
  userEmail: string;
  emailUrl: string;
}

const EmailVerification = (props: EmailVerificationProps) => {
  const { userEmail, emailUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "#fafafa",
                foreground: "#3e3e3e",
                card: "#ffffff",
                primary: {
                  DEFAULT: "#825447",
                  foreground: "#ffffff",
                },
                muted: {
                  DEFAULT: "#f3f3f3",
                  foreground: "#808080",
                },
                border: "#e5e5e5",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-background font-sans py-[40px]">
          <Container className="bg-card border border-border rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[24px] font-bold text-foreground m-0">
                Verify Your Email Address
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-muted-foreground leading-[24px] mb-[16px]">
                Hi there,
              </Text>
              <Text className="text-[16px] text-muted-foreground leading-[24px] mb-[16px]">
                Thanks for signing up! To complete your registration and secure
                your account, please verify your email address by clicking the
                button below.
              </Text>
              <Text className="text-[16px] text-foreground leading-[24px] mb-[24px]">
                Email: <strong>{userEmail}</strong>
              </Text>
            </Section>

            {/* Verification Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={emailUrl}
                className="bg-primary text-primary-foreground px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-muted-foreground leading-[20px]">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>
              <Text className="text-[14px] text-primary break-all">
                {emailUrl}
              </Text>
            </Section>

            {/* Security Note */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-muted-foreground leading-[20px]">
                This verification link will expire in 24 hours for security
                reasons. If you didn&apos;t create an account, you can safely
                ignore this email.
              </Text>
            </Section>

            <Hr className="border-border my-[24px]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[12px] text-muted-foreground leading-[16px] m-0">
                © 2025 ZendraPdf.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;

