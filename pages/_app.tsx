import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { WithApolloProps, withApollo } from '../graphql/apollo';

class RootApp extends App<WithApolloProps> {
    render() {
        const { Component, pageProps, apolloClient } = this.props;
        return (
            <Container>
                <ApolloProvider client={apolloClient}>
                    <Component {...pageProps} />
                </ApolloProvider>
            </Container>
        );
    }
}

export default withApollo(RootApp);
