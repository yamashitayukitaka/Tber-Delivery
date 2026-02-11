import { Address } from "@/types";
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { message: 'ユーザーが認証されていません' },
        { status: 401 }
      )
    }
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('id, name, address_text, latitude, longitude')
      .eq('user_id', user.id)
    if (addressError) {
      console.error('住所情報の取得に失敗しました', addressError);
      return NextResponse.json(
        { error: '住所情報の取得に失敗' },
        { status: 500 }
      )
    }

    addressList = addressData;
    const { data: selectedAddressData, error: selectedAddressError } = await supabase
      .from('profiles')
      .select(`
        addresses (
          id,
          name,
          address_text,
          latitude,
          longitude
        )
      `)
      .eq('id', user.id)
      .single()
    if (selectedAddressError) {
      console.error('プロフィール情報の取得に失敗しました', selectedAddressError);
      return NextResponse.json(
        { error: 'プロフィール情報の取得に失敗しました' },
        { status: 500 }
      )
    }
    selectedAddress = selectedAddressData.addresses;

    console.log('addressesデータ', addressList);
    console.log('selected_addressデータ', selectedAddress);
    return NextResponse.json({ addressList, selectedAddress }, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}




