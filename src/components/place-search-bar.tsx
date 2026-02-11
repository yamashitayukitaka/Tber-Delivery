'use client'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { RestaurantSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";

interface PlaceSearchBarProps {
  lat: number;
  lng: number;
}

export default function PlaceSearchBar({ lat, lng }: PlaceSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('')
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const clickedOnItem = useRef(false);
  const router = useRouter()
  const searchParams = useSearchParams();


  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setErrorMessage(null)
    console.log(input)
    try {
      const response = await fetch(`/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}&lat=${lat}&lng=${lng}`, {
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error)
        return;
      }

      const data: RestaurantSuggestion[] = await response.json();
      console.log('suggestion_data', data); // データ使用
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
      setOpen(false);
      return;
    }
    setIsLoading(true)
    setOpen(true);
    fetchSuggestions(inputText);

  }, [inputText])
  const handleBlur = () => {
    if (clickedOnItem.current) {
      clickedOnItem.current = false
      return;
    }
    setOpen(false)
  }

  const handleFocus = () => {
    if (inputText) {
      setOpen(true)
    }
  }

  const handleSelectSuggestion = (suggestion: RestaurantSuggestion) => {
    console.log('suggestion', suggestion)
    if (suggestion.type === 'placePrediction') {
      router.push(`/restaurant/${suggestion.placeId}?sessionToken=${sessionToken}`)
      setSessionToken(uuidv4());
    }
    else {
      router.push(`/search?restaurant=${suggestion.placeName}`)
    }
    setOpen(false)
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e)
    if (!inputText.trim()) return;
    if (e.key === "Enter") {
      router.push(`/search?restaurant=${inputText}`)
      setOpen(false)
    }
  }


  return (
    <Command onKeyDown={handleOnKeyDown} className="overflow-visible bg-muted h-9" shouldFilter={false}>
      <CommandInput placeholder="店舗名で検索する"
        value={inputText}
        onValueChange={
          setInputText
        }
        onBlur={handleBlur}
        onFocus={handleFocus}
      />

      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
            <CommandEmpty>
              <div className="flex items-center justify-center">
                {isLoading ? (<LoaderCircle className="animate-spin" />) :
                  errorMessage ? (
                    <div className="flex items-center text-destructive gap-2">
                      <AlertCircle />{errorMessage}
                    </div>
                  ) : (
                    'レストランが見つかりません'
                  )}
              </div>
            </CommandEmpty>
            {suggestions.map((suggestion, index) => (
              <CommandItem
                className="p-5"
                key={suggestion.placeId ?? index}
                value={suggestion.placeName}
                onSelect={() => handleSelectSuggestion(suggestion)}
                onMouseDown={() => clickedOnItem.current = true}
              >
                {suggestion.type === 'placePrediction' ?
                  <Search /> :
                  <MapPin />
                }
                <p>
                  {suggestion.placeName}
                </p>
              </CommandItem>
            ))}
            <CommandSeparator />
          </CommandList>
        </div>
      )
      }
    </Command>
  )
}


