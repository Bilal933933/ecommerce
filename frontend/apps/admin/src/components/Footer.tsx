export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-muted/30 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">البيان</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            منصة تعليمية عربية شاملة تهدف إلى تقديم أفضل تجربة تعلم للمستخدمين العرب
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-foreground">روابط سريعة</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    الرئيسية
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    من نحن
                                </a>
                            </li>
                            <li>
                                <a href="/products" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    المنتجات
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-foreground">تواصل معنا</h4>
                        <div className="space-y-2 text-muted-foreground text-sm">
                            <p><strong className="text-foreground">البريد:</strong> blalsame123@gmail.com</p>
                            <p><strong className="text-foreground">الهاتف:</strong> 01007134540</p>
                            <div className="pt-4 space-y-2 border-t border-border">
                                <a href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors block">
                                    سياسة الخصوصية
                                </a>
                                <a href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors block">
                                    الشروط والأحكام
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">
                        جميع الحقوق محفوظة &copy; {currentYear} البيان
                    </p>
                    <p className="text-muted-foreground text-sm">
                        طور بـ ❤️ بواسطة{" "}
                        <a href="https://github.com/ahmed-fawzy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                            بلال النجار
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}