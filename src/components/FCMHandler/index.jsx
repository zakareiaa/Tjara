import React, { useEffect } from 'react';
import FCMTokens from "@client/FCMTokensClient";
import { useAuth } from "@contexts/Auth";

const FCMHandler = () => {
    const { currentUser } = useAuth();

    useEffect(() => {
        // console.log('[FCM] Handler mounting...');

        // Define the token handler
        window.updateFCMToken = async (token) => {
            // console.log('[FCM] Processing token:', token);
            try {
                const params = {};
                if (currentUser?.id) {
                    params.user_id = currentUser?.id;
                }

                const { data, error } = await FCMTokens.createOrUpdateFCMToken(token, params);

                if (data) {
                    console.log('[FCM] Token registered successfully:', data.message);
                }

                if (error) {
                    console.error('[FCM] Error registering token:', error);
                }
            } catch (error) {
                console.error('[FCM] Error registering token:', error);
            }
        };

        // Signal that FCM is ready
        // console.log('[FCM] Setting ready state...');
        window.FCM_READY = true;

        // Process any queued callbacks
        if (Array.isArray(window.FCM_CALLBACKS)) {
            // console.log('[FCM] Processing queued callbacks...');
            window.FCM_CALLBACKS.forEach(callback => {
                try {
                    callback();
                } catch (e) {
                    console.error('[FCM] Error in callback:', e);
                }
            });
            window.FCM_CALLBACKS = [];
        }

        return () => {
            // Cleanup
            // console.log('[FCM] Handler unmounting...');
            window.FCM_READY = false;
            if (Array.isArray(window.FCM_CALLBACKS)) {
                window.FCM_CALLBACKS = [];
            }
        };
    }, [currentUser]);

    return null;
};

export default FCMHandler;