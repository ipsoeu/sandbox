$(document).ready(function () {

    var apps_streamings = [
        {
            'name': 'IT_immuni',
            'keys': ["#Immuni", "Immuni", "immuniapp", "appimmuni"]
        },

        {
            'name': "AT_stopp_corona",
            'keys': ["Stopp Corona", "#StoppCorona", "stopp-corona", "StoppCorona", "stopp-corona-app", "#StoppCoronaApp", "StoppCoronaApp"],
        },

        {
            'name': "BG_viru_safe",
            'keys': ["ViruSafe", "#ViruSafe"],
        },

        {
            'name': "CY_cov_tracer",
            'keys': ["CovTracer", "#CovTracer"],
        },

        {
            'name': "CZ_eRouska",
            'keys': ["eRouska", "#eRouska"],
        },

        {
            'name': "DK_smittestop",
            'keys': ["Smittestop", "#Smittestop"],
        },

        {
            'name': "FR_StopCovid",
            'keys': ["StopCovid", "#StopCovid", "TousAntiCovid", "#TousAntiCovid"]
        },
        {
            'name': "DE_Corona_Warn_App",
            'keys': ["Corona-Warn-App", "corona warn app", "#CoronaWarnApp", "CoronaWarnApp"],
        },

        {
            'name': "PL_protego",
            'keys': ["ProteGO Safe", "#ProtegoSafe", "ProtegoSafe"],
        },
        {
            'name': "CH_swisscovid",
            'keys': ["swisscovid", "Swiss Contact Tracing App", "Swiss contact-tracing", "#SwissCovid"],
        },
        {
            'name': "UK_nhs_COVID_19_app",
            'keys': ["NHS COVID-19 App"],
        },
        {
            'name': "ES_radar_covid",
            'keys': ["RadarCovid", "#RadarCovid", "radar covid"],
        },
        {
            'name': "IE_covid_tracker_ireland",
            'keys': ["COVID Tracker Ireland", "#CovidTrackerIreland", "#COVID19Ireland", "COVID tracker app"],
        },
    ]


    $('#app_list_streaming').DataTable({
        data: apps_streamings,
        columns: [
            { data: function(e){return e.name.slice(0,2);}, title: "Country" },
            { data: function(e){return e.name.slice(3).replace('_', ' ');}, title: "App name" },
            { data: function(e){return e.keys.join(', ');}, title: "Search keys" },
            
        ],
        order: [[0, "asc"]],
        paging: false,
        searching: false,
        
    });


    $('#app_list').DataTable({
        data: DATA_TABLE,
        columns: [
            { title: "Mobile application name" },
            { title: "Number of tweets" },
            { title: "Tweets with opinions (%)" },
            { title: "Geolocalized tweets (%)" },
            { title: "Extracted EMM news" },
        ],
        order: [[1, "desc"]],
        paging: false,
        searching: false
    });

});