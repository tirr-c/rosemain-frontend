import * as React from 'react';
import { Query } from 'react-apollo';
import Layout from '../components/Layout';
import { GET_SERIES } from '../graphql';

interface Props {
}

class Index extends React.PureComponent<Props> {
    render() {
        return (
            <Layout title="Apollo Test">
                <Query query={GET_SERIES} variables={{ code: '' }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return 'Loading...';
                        }

                        if (error) {
                            return `Error: ${error.message}`;
                        }

                        return (
                            `${data.series.id} ${data.series.availableLanguages.join(' ')}`
                        );
                    }}
                </Query>
            </Layout>
        );
    }
}

export default Index;
