import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { fetchApi } from "@/hooks/useFetchApi";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";

export default function HomeContentLayout() {
    const [getData, setData] = useState<{ name: string, authToken: string }[]>([])

    useEffect(() => {
        fetchApi('https://stevedao.xyz/fp/users').then((res) => {
            console.log(res)
        }
        ).catch((err) => {
            console.log(err)
        }
        )
    }, [])

    return (
        <ThemedView style={{ flex: 1, padding: 16 }}>

            <FlatList
                data={getData}
                renderItem={user => (
                    <ThemedText style={{ padding: 16 }} type="default">{`Item ${user.item.name}`}</ThemedText>
                )}
            />
        </ThemedView>
    );
}