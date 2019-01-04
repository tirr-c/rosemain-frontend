import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import fetch from 'cross-fetch';
import App, { AppComponentType, DefaultAppIProps, NextAppContext } from 'next/app';
import Head from 'next/head';
import { DefaultQuery } from 'next/router';
import * as React from 'react';
import { getDataFromTree } from 'react-apollo';

const isServer = 'process' in global;
let apolloClient: ApolloClient<any> | undefined;

function createClient(initialState: any = {}) {
    return new ApolloClient({
        connectToDevTools: !isServer,
        ssrMode: isServer,
        link: new HttpLink({
            uri: 'http://localhost:8000/graphql',
            fetch,
        }),
        cache: new InMemoryCache().restore(initialState),
    });
}

export function initApollo(initialState: any = {}): ApolloClient<any> {
    if (isServer) {
        return createClient(initialState);
    }

    if (apolloClient == null) {
        apolloClient = createClient(initialState);
    }

    return apolloClient;
}

export type WithApolloProps<Props = {}> = Props & { apolloClient: ApolloClient<any>; };
export function withApollo<P = {}, IP = P, Q extends DefaultQuery = DefaultQuery>(
    InnerApp: AppComponentType<WithApolloProps<P>, IP, NextAppContext<Q>>,
) {
    interface ApolloAppProps extends DefaultAppIProps {
        apolloState: any;
    }

    return class Apollo extends App<P & ApolloAppProps> {
        static displayName = `withApollo(${InnerApp.displayName})`;
        static async getInitialProps(ctx: NextAppContext<Q>): Promise<any> {
            const { Component, router } = ctx;
            const appProps = ('getInitialProps' in InnerApp) ? (await InnerApp.getInitialProps(ctx)) : {};

            const apollo = initApollo();
            if (isServer) {
                try {
                    await getDataFromTree(
                        <InnerApp
                            {...appProps}
                            Component={Component}
                            router={router}
                            apolloClient={apollo}
                        />
                    );
                } catch (err) {
                    console.error('getDataFromTree returned an error:', err);
                }
                Head.rewind();
            }

            const apolloState = apollo.cache.extract();

            return {
                ...appProps,
                apolloState,
            };
        }

        private apolloClient = initApollo(this.props.apolloState);

        render() {
            return (
                <InnerApp
                    {...this.props}
                    apolloClient={this.apolloClient}
                />
            );
        }
    }
}
