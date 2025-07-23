import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background/50 border-t border-border/40 lg:pl-64">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="cursor-pointer transition-transform duration-200 group-hover:scale-110"
              />{" "}
              <span className="text-foreground font-bold text-lg">
                Trip Genie
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Making travel planning smarter, faster, and more personalized with
              AI-powered insights. 🌍
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Product 🚀</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Features ✨
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Pricing 💰
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    API 💻
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Company 🏢</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    About Us 🧑‍💼
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Blog 📰
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Careers 💼
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">Support ❓</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Help Center 🙋‍♀️
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Contact Us 📞
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Privacy Policy 🔒
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Terms and Conditions 📜
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Cancellation and Refund 💸
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Shipping and Delivery 🚚
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trip Genie. All rights reserved.
            Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
