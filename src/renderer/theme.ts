import {
    extendTheme,
    withDefaultColorScheme,
    defineStyleConfig,
    theme as baseTheme,
} from "@chakra-ui/react";

const ButtonStyle = defineStyleConfig({
    // The styles all button have in common
    baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "base", // <-- border radius is same for all variants and sizes
    },
    // Two sizes: sm and md
    sizes: {
        sm: {
            fontSize: "sm",
            px: 4, // <-- px is short for paddingLeft and paddingRight
            py: 3, // <-- py is short for paddingTop and paddingBottom
        },
        md: {
            fontSize: "md",
            px: 6, // <-- these values are tokens from the design system
            py: 4, // <-- these values are tokens from the design system
        },
    },
    // Two variants: outline and solid
    // variants: {
    //   outline: {
    //     border: '2px solid',
    //     borderColor: 'purple.500',
    //   },
    //   solid: {
    //     color: 'white',
    //   },
    // },
    // The default size and variant values
    defaultProps: {
        size: "md",
        variant: "outline",
    },
});

const theme = extendTheme(
    {
        config: {
            initialColorMode: "dark",
        },
        colors: {
            // brand: ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82', '#AD1374'],
            brand: baseTheme.colors.green,
        },
        components: {
            Button: ButtonStyle,
        },
    },
    withDefaultColorScheme({
        colorScheme: "brand",
    }),
);

export default theme;
