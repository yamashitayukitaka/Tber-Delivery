import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Heart, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark } from 'lucide-react';
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/(auth)/login/actions";

const MenuSheet = async () => {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  const avatar_url = user?.user_metadata?.avatar_url || '';
  const full_name = user?.user_metadata?.full_name || '';

  if (!user) {
    return;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-72 p-6" side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>
            ユーザー情報とメニュー情報
          </SheetDescription>
        </SheetHeader>

        {/* ユーザー情報エリア */}
        <div className="flex items-center gap-5">
          <div>
            <Avatar>
              <AvatarImage src={avatar_url} />
              <AvatarFallback>ユーザー名</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>{full_name}</div>
          </div>
        </div>

        {/* メニューエリア */}
        <ul className="space-y-4">
          <li>
            <Link href={"/orders"} className="flex items-center gap-4">
              <Bookmark fill="bg-primary" />
              <span className="font-bold">ご注文内容</span>
            </Link>
          </li>
        </ul>
        <SheetFooter>
          <form>
            <Button formAction={logout} className="w-full">ログアウト</Button>
          </form>
          <SheetClose asChild>
            <Button variant="outline">閉じる</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MenuSheet

