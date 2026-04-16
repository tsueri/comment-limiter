<?php
/*
Plugin Name: Comment Limiter
Description: A simple plugin that limit the maximum and minimum of characters allowed in a post comment
Version:     2.2.3
Author:      Anass Rahou
Author URI:  https://wpbody.com/
License:     GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: comment-limiter
Domain Path: /languages
*/

defined( 'ABSPATH' ) || exit;


if( ! defined( 'CL_VERSION' ) ) {
  define( 'CL_VERSION', '2.2.3' );
}

if ( ! defined( 'CL_PLUGIN_PATH' ) ) {
  define( 'CL_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
}

$files = [
    'includes/class-comment-limiter-i18n.php',
    'includes/class-comment-limiter-config.php',
    'includes/class-comment-limiter-settings.php',
    'includes/class-comment-limiter-deactivator.php'
];

foreach ( $files as $file ) {
    $path = CL_PLUGIN_PATH . $file;
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}


Comment_Limiter_i18n::factory();
Comment_Limiter_Config::factory();
Comment_Limiter_Settings::factory();
Comment_Limiter_Deactivator::factory();


/**
 * Add settings link to plugin actions
 *
 * @param  array  $plugin_actions
 * @param  string $plugin_file
 * @since  1.0
 * @return array
 */
function cl_filter_plugin_action_links( $plugin_actions, $plugin_file ) {
    // Ensure $plugin_actions is an array
    if ( ! is_array( $plugin_actions ) ) {
        $plugin_actions = [];
    }

    // Check if the current plugin is the Comment Limiter
    if ( basename( CL_PLUGIN_PATH ) . '/comment-limiter.php' === $plugin_file ) {
        $settings_link = sprintf(
            '<a href="%s">%s</a>',
            esc_url( admin_url( 'edit-comments.php?page=comment-limiter' ) ),
            esc_html__( 'Settings', 'comment-limiter' )
        );
        
        // Add the settings link to the array
        $plugin_actions['cl_settings'] = $settings_link;
    }

    return array_merge( $plugin_actions, $plugin_actions );
}
add_filter( 'plugin_action_links', 'cl_filter_plugin_action_links', 10, 2 );



