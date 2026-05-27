import { HugeiconsIcon } from "@hugeicons/react-native"
import { StyleSheet, Text, View } from "react-native"
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon"
import { colors } from "@/theme/colors"
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';

interface Props {
    type : string 
}

const TransactionCard = ({ type } : Props) => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={20}
            color={colors.textSecondary}
          />
        </View>
        <Text style={styles.date}>01 June 2025</Text>
      </View>
     <View>
       <View style={styles.card}>
        {type === "expense" && (
          <View style={styles.iconWrapper}>
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={24}
              color={"#9176F9"}
            />
          </View>
        )}
        <View style={styles.firstRow}>
          <Text style={[
            styles.title, 
            type === "income" ? styles.incomeTitle : styles.expenseTitle
          ]}>
            Shopping
          </Text>
          {
            type==="income" ? <Text style={[styles.money,styles.incomeMoney]}>+3000</Text >:<Text style={[styles.money,styles.expenseMoney]}>+4000</Text>
          }
        </View>
       </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "94%",
    gap: 12,
  },
  content: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  date: {
    color: colors.textSecondary,
    fontFamily: "Changa_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 6,
    alignItems: "center", // Added to align items vertically
  },
  iconWrapper: {
    padding: 4,
    backgroundColor: "#ede9fa",
    borderWidth: 2,
    borderColor: "#ede9fa",
    borderRadius: 8,
    marginTop:2,
  },
  title: {
    fontFamily: "Changa_500Medium",
    
  },
  expenseTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  incomeTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  firstRow:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    overflow:"hidden",
  },
  money:{
    fontFamily:"Changa_500Medium",
    fontSize:16,
    lineHeight:24,
  },
  expenseMoney:{
    color:"red"
  },
  incomeMoney:{
    color:"green"
  }
})

export default TransactionCard