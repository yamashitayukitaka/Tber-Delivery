'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';
import { AddressSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { deleteAddressAction, selectAddressAction, selectSuggestionAction } from "@/app/(private)/actions/AddressActions";
import useSWR from "swr";
import { Address } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


interface AddressResponse {
  addressList: Address[];
  selectedAddress: Address | null;
}

export default function AddressModal() {
  const [inputText, setInputText] = useState('')
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter();


  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setErrorMessage(null)
    try {
      const response = await fetch(`/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`, {
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error)
        return;
      }

      const data: AddressSuggestion[] = await response.json();
      setSuggestions(data)

    } catch (error) {
      console.error(error);
      setErrorMessage('予期せぬエラーが発生しました')
    }
    finally {
      setIsLoading(false)
    }
  }, 500)


  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true)
    fetchSuggestions(inputText);

  }, [inputText])
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      return { addressList: [], selectedAddress: null };
    }
    const data = await response.json();
    return data;
  }

  const { data, error, isLoading: loading, mutate } = useSWR<AddressResponse>(`/api/address`, fetcher)
  if (error) {
    console.error('エラー', error);
    return <div>{error.message}</div>
  }
  if (loading) return <div>loading...</div>

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    try {
      await selectSuggestionAction(suggestion, sessionToken);
      setSessionToken(uuidv4());
      setInputText('');
      mutate();
      router.refresh();
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
    }
  }

  const handleSelectAddress = async (address: Address) => {
    console.log('address', address)
    try {
      await selectAddressAction(address.id);
      mutate();
      router.refresh();
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    const ok = window.confirm('住所を削除しますか？')
    if (!ok) return;
    try {
      const selectedAddressId = data?.selectedAddress?.id;
      await deleteAddressAction(addressId);
      mutate();
      if (selectedAddressId === addressId) {
        router.refresh();
      }
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
    }
  }



  return (
    <Dialog>
      <DialogTrigger>
        <span
          className="
      inline-flex 
      items-center 
      justify-center 
      gap-2 
      px-4 py-2 
      rounded-md 
      bg-blue-500 
      text-white 
      font-medium 
      hover:bg-blue-600 
      focus:outline-none 
      focus:ring-2 
      focus:ring-blue-400 
      cursor-pointer
    "
        >
          クリックして住所を検索　{data?.selectedAddress ? `現在地：${data.selectedAddress.name}` : '未選択'}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <div className="bg-muted mb-4">
            <CommandInput
              value={inputText}
              onValueChange={setInputText}
            />
          </div>
          <CommandList>
            {inputText ? (
              <>
                <CommandEmpty>
                  <div className="flex items-center justify-center">
                    {isLoading ? (<LoaderCircle className="animate-spin" />) :
                      errorMessage ? (
                        <div className="flex items-center text-destructive gap-2">
                          <AlertCircle />{errorMessage}
                        </div>
                      ) : (
                        '住所が見つかりません。'
                      )}
                  </div>
                </CommandEmpty>
                {suggestions.map((suggestion) => (
                  <CommandItem key={suggestion.placeId} className="p-5" onSelect={() => handleSelectSuggestion(suggestion)}>
                    <MapPin />
                    <div>
                      <p className="font-bold">{suggestion.placeName}</p>
                      <p className="test-muted-foreground">{suggestion.address_text}</p>
                    </div>
                  </CommandItem>
                ))}
              </>
            ) : (
              <>
                <h3 className="font-black text-lg mb-2">保存済みの住所</h3>

                {data?.addressList.map((address) => (
                  <CommandItem
                    onSelect={() => handleSelectAddress(address)}
                    key={address.id} className={cn("p-5 justify-between items-center", data.selectedAddress?.id === address.id && "bg-red-500")}>
                    <div>
                      <p className="font-bold">{address.name}</p>
                      <p className="test-muted-foreground">{address.address_text}</p>
                    </div>
                    <Button size="icon" variant={'ghost'} onClick={(e) => {
                      handleDeleteAddress(address.id);
                      e.stopPropagation();
                    }}>
                      <Trash2 />
                    </Button>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}