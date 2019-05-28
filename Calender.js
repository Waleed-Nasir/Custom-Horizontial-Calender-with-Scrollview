import React from 'react';
import { Image, TouchableOpacity, StyleSheet, Text, View, ScrollView, Dimensions, FlatList } from 'react-native';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = ["", "", "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December", "", ""];
export default class Calender extends React.Component {
    static navigationOptions = {
        header: null,
    }
    constructor() {
        super();
        this.state = {
            Days: [],
            Years: [],
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth(),
            selectedDate: new Date().getDate(),
            yearArray: {},
            monthArray: {},
            dateArray: {}
        }
    }
    componentWillMount() {
        const { selectedYear, selectedMonth, selectedDate } = this.state
        /////Month/Year//////            
        this.getDaysInMonth(selectedMonth, selectedYear),
            this.getYears(1998, selectedYear + 50)
    }
    componentDidMount() {
        const { needDate = false, needMonths = false, needYears = false } = this.props
        const { selectedYear, selectedMonth, selectedDate } = this.state
        setTimeout(() => {
            var index = selectedDate < 4 ? 0 : selectedDate - 3
            needDate && this.dateRef && this.dateRef.scrollTo({ x: this.state.dateArray[index] });
            needMonths && this.monthRef && this.monthRef.scrollTo({ x: this.state.monthArray[selectedMonth] });
            needYears && this.yearRef && this.yearRef.scrollTo({ x: this.state.yearArray[selectedYear - 1] });
        },500);
    }
    getDaysInMonth = (month, year) => {
        // Since no month has fewer than 28 days
        var date = new Date(year, month, 1);
        var days = [];

        while (date.getMonth() === month) {
            days.push({ date: date.getDate(), days: weekday[date.getDay()] });
            date.setDate(date.getDate() + 1);
        }
        this.setState({ Days: days });
    }
    getYears = (start, end) => {
        var ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        this.setState({ Years: ans });
    }

    handlerDate = (getDate) => {
        const { selectedYear, selectedMonth, selectedDate } = this.state
        var index = getDate < 4 ? 0 : getDate - 3
        this.dateRef.scrollTo({ x: this.state.dateArray[index] });
        this.setState({ selectedDate: getDate })
        const { returnTimeStamp = callback = () => { } } = this.props
        returnTimeStamp({ selectedYear, selectedMonth, selectedDate: getDate })
    }
    handlerMonths = (month) => {
        const { selectedYear, selectedDate } = this.state
        var index = monthNames.indexOf(month) - 2
        this.monthRef.scrollTo({ x: this.state.monthArray[index] });
        var selectedMonth = monthNames.indexOf(month)
        this.setState({ selectedMonth: selectedMonth })
        this.getDaysInMonth(index, selectedYear)
        const { returnTimeStamp = callback = () => { } } = this.props
        returnTimeStamp({ selectedYear, selectedMonth, selectedDate })
    }

    handlerYear = (year,key) => {
        const { selectedMonth, selectedDate } = this.state
        this.yearRef.scrollTo({ x: this.state.yearArray[year - 1] });
        this.setState({ selectedYear: year })
        this.getDaysInMonth(selectedMonth, year)
        var selectedYear = year
        const { returnTimeStamp = callback = () => { } } = this.props
        returnTimeStamp({ selectedYear, selectedMonth, selectedDate })
    }
    render() {
        const { Days, Years,selectedYear, selectedMonth, selectedDate } = this.state
        const { needDate = false, needMonths = false, needYears = false } = this.props
        return (
            <View style={styles.container}>
                {needDate && <View style={styles.Datecontainer}>
                    <ScrollView horizontal={true} ref={(ref) => this.dateRef = ref} >
                        {Days.map((item,key) => <TouchableOpacity
                            onPress={() => this.handlerDate(item.date)}
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                this.state.dateArray[item.date] = layout.x;
                            }}  key={key}>
                            <View style={[styles.cont,key+1 === selectedDate &&{ borderBottomWidth:1, borderBottomColor: "#00fa9a",}]}>
                                <Text style={[styles.dateText,key+1 === selectedDate &&{color:'#00fa9a', borderBottomWidth: 3, borderBottomColor: "#00fa9a",}]}>{item.date}</Text>
                                <Text style={styles.dayText}>{item.days}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </View>
                }
                {needMonths && <View style={styles.Monthcontainer}>

                    <ScrollView horizontal={true} ref={(ref) => this.monthRef = ref}>
                        {monthNames.map((item, key) => <TouchableOpacity key={key} onPress={() => this.handlerMonths(item)}
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                this.state.monthArray[key] = layout.x;
                            }}>
                            <View style={[styles.month,key === selectedMonth &&{ borderBottomWidth:1, borderBottomColor: "#00fa9a",}]}>
                                <Text style={styles.monthText}>{item}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </View>}
                {needYears && <View style={styles.Yearcontainer}>
                    <ScrollView horizontal={true} ref={(ref) => this.yearRef = ref}>
                        {Years.map((item,key) => <TouchableOpacity key={key} onPress={() => this.handlerYear(item,key)}
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                this.state.yearArray[item] = layout.x;
                            }}>
                            <View style={[styles.year,key === this.state.Years.indexOf(selectedYear) &&{ borderBottomWidth:1, borderBottomColor: "#00fa9a",}]}>
                                <Text style={[styles.yearText,key === this.state.Years.indexOf(selectedYear) &&{ color: "#00fa9a",}]}>{item}</Text>
                            </View>
                        </TouchableOpacity>)}
                    </ScrollView>
                </View>}
            </View >


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        width: screenWidth,
        backgroundColor: 'white',

    },
    Datecontainer: {
        flex: 1,
        width: screenWidth,
        backgroundColor: 'white',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    Monthcontainer: {
        flex: 0.7,
        width: screenWidth,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',

    },
    Yearcontainer: {
        flex: 0.8,
        width: screenWidth,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',

    },
    ScrollViewcontainer: {
        // width:screenWidth,
        flexDirection: 'row',
        // padding:12

    },
    cont: {
        width: screenWidth / 7,
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    dateText: {
        fontSize: 18,
        color: 'black',
        justifyContent: 'center',
        textAlign: 'center',
    },
    dayText: {
        fontSize: 12,
        color: 'gray',
        justifyContent: 'center',
        textAlign: 'center',
    },
    month: {
        width: screenWidth / 5,
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    monthText: {
        fontSize: 13,
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    year: {
        width: screenWidth / 3,
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    yearText: {
        fontSize: 16,
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    }
});
