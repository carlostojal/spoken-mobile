import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions } from "react-native";
import {
	LineChart,
	PieChart,
	BarChart
} from "react-native-chart-kit";
import { useQuery } from "@apollo/client";

import queries from "./queries";
import CustomText from "../../Misc/CustomText";
import { useTranslation } from "react-i18next";
import Header from "../../Misc/Header";
import Post from "../../Misc/Post";

export default function PostAnalytics(props) {

	const { t } = useTranslation();

	const [post, setPost] = useState(JSON.parse(props.route.params.post));

	const {data: viewsByPlatformData, loading: viewsByPlatformLoading, error: viewsByPlatformError} = useQuery(queries.GET_ANALYTICS, {
		variables: {
			id: post._id,
			type: "views_by_platform"
		}
	});

	const {data: viewsByOSData, loading: viewsByOSLoading, error: viewsByOSError} = useQuery(queries.GET_ANALYTICS, {
		variables: {
			id: post._id,
			type: "views_by_os"
		}
	});

	const {data: viewsByAgeData, loading: viewsByAgeLoading, error: viewsByAgeError} = useQuery(queries.GET_ANALYTICS, {
		variables: {
			id: post._id,
			type: "views_by_age_range"
		}
	});

	const {data: viewsByHourData, loading: viewsByHourLoading, error: viewsByHourError} = useQuery(queries.GET_ANALYTICS, {
		variables: {
			id: post._id,
			type: "views_by_hour"
		}
	});

	return (
		<ScrollView>
			<Header>
				{ t("screens.analytics.title") }
			</Header>
			<Post data={post} renderFooter={false} />
			<CustomText style={{fontSize: 25, margin: 15}}>
				{ t("screens.analytics.labels.views_by_hour") }
			</CustomText>
			{ viewsByHourData && viewsByHourData.getPostAnalytics &&
				<LineChart
					data={{
						labels: viewsByHourData.getPostAnalytics.labels,
						datasets: [
							{
								data: viewsByHourData.getPostAnalytics.values
							}
						]
					}}
					width={Dimensions.get("window").width}
					height={240}
					chartConfig={{
						decimalPlaces: 0, // optional, defaults to 2dp
						color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16
						}
					}}
					bezier={true}
				/>
			}
			<CustomText style={{fontSize: 25, margin: 15}}>
				{ t("screens.analytics.labels.views_by_age_range") }
			</CustomText>
			{ viewsByAgeData && viewsByAgeData.getPostAnalytics &&
				<BarChart
					data={{
						labels: viewsByAgeData.getPostAnalytics.labels,
						datasets: [
							{
								data: viewsByAgeData.getPostAnalytics.values
							}
						]
					}}
					width={Dimensions.get("window").width}
					height={240}
					chartConfig={{
						decimalPlaces: 0, // optional, defaults to 2dp
						color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16
						}
					}}
				/>
			}
			<CustomText style={{fontSize: 25, margin: 15}}>
				{ t("screens.analytics.labels.views_by_platform") }
			</CustomText>
			{ viewsByPlatformData && viewsByPlatformData.getPostAnalytics &&
				<BarChart
					data={{
						labels: viewsByPlatformData.getPostAnalytics.labels,
						datasets: [
							{
								data: viewsByPlatformData.getPostAnalytics.values
							}
						]
					}}
					width={Dimensions.get("window").width}
					height={240}
					chartConfig={{
						decimalPlaces: 0, // optional, defaults to 2dp
						color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16
						}
					}}
				/>
			}
			<CustomText style={{fontSize: 25, margin: 15}}>
				{ t("screens.analytics.labels.views_by_os") }
			</CustomText>
			{ viewsByOSData && viewsByOSData.getPostAnalytics &&
				<BarChart
					data={{
						labels: viewsByOSData.getPostAnalytics.labels,
						datasets: [
							{
								data: viewsByOSData.getPostAnalytics.values
							}
						]
					}}
					width={Dimensions.get("window").width}
					height={240}
					chartConfig={{
						decimalPlaces: 0, // optional, defaults to 2dp
						color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16
						}
					}}
				/>
			}
		</ScrollView>
	);
}