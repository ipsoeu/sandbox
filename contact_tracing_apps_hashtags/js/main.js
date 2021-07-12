$(document).ready(function() {
    
  
    $('#community_table').DataTable({
        data: HASHTAGS_COMMUNITIES,
        columns: [
            { data: function(d){
                return d.hashtags.slice(0,5).map(function(e){return e.hashtag}).join(', ');
            }, title: 'Top 5 hashtags' },

            { data: function(d){
                return d.mobile_apps.slice(0,1).map(function(e){return e.name}).join(', ');
            }, title: 'Main mobile app' },

            { data: "hashtags_count", title: "Number of Hashtags" },

            { data: "total_tweets", title: 'Number of Tweets' },
            { data: "community_isolation_by_tweets", title: 'Isolation index' },
            
        ],
        order: [[3, "desc"]],      
    });
} );

//dict_keys(['tweets_ids', 'hashtags', 'total_tweets', 'isolated_tweets', 'shared_tweets', 'community_isolation_by_tweets', 'isolated_geolocalized_tweets', 'isolated_mobile_apps', 'isolated_neutral_tweets', 'isolated_positive_tweets', 'isolated_negative_tweets', 'isolated_emm_news', 'geolocalized_tweets', 'mobile_apps', 'neutral_tweets', 'positive_tweets', 'negative_tweets', 'emm_news'])
//https://stackoverflow.com/questions/39617207/datatables-set-complex-headers-from-javascript