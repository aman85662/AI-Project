import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  await checkUser();
    return (
      <header className="fixed top-0 border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60 w-full">
        <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Sensai-Logo" width={100} height={100} className="h-12 py-2 w-auto object-contain" />
          </Link>

          <div className="flex items-center space-x-4">
            <SignedIn>
              {/* Use asChild for Button inside Link if supported */}
              <Button asChild variant="outline">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="hidden md:block">Industry Insights</span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <StarsIcon className="h-6 w-4" />
                    <span className="hidden md:block">Growth-Tools</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/resume" className="flex items-center gap-2 w-full">
                      <FileText className="h-2 w-2" />
                      <span>Build-Resume</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ai-cover-letter" className="flex items-center gap-2 w-full">
                      <PenBox className="h-2 w-2" />
                      <span>Cover-Letter</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2 w-full">
                      <GraduationCap className="h-2 w-2" />
                      <span>Interview-prep</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Subscription
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                    userPreviewPopoverCard: 'shadow-xl',
                    userPreviewMainIdentifier: "font-semibold",
                  }
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </nav>
      </header>
    );
}

export default Header;
