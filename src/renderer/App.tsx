import { useCallback, useState, useRef, useEffect } from 'react';
import {
    Button,
    ChakraProvider,
    HStack,
    Text,
    Textarea,
    VStack,
    useToast,
} from '@chakra-ui/react';

import theme from './theme';
// import icon from '../../assets/icon.svg';
import './App.css';

export default function App() {
    const toast = useToast();

    const rawTextareaRef = useRef<HTMLTextAreaElement>(null);

    const [sourceMapFile, setSourceMapFile] = useState('');
    const [raw, setRaw] = useState('');
    const [result, setResult] = useState('');

    const [isRunning, setRunning] = useState(false);
    const [isDragOver, setDragOver] = useState(false);

    useEffect(() => {
        const dragOverListener = (e) => {
            // prevent default to allow drop
            e.preventDefault();
        };
        const dragEnterListener = () => {
            setDragOver(true);
        };
        const dragLeaveListener = () => {
            setDragOver(false);
        };

        const dropListener = (e) => {
            e.preventDefault();
            e.stopPropagation();

            setDragOver(false);

            const { files } = e.dataTransfer;
            if (files) {
                if (files.length > 1) {
                    toast({
                        title: 'Failed drop',
                        description: 'More than one file dropped',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    // there
                    const file = files[0];
                    // there's file.path - path to the file in the local filesystem
                    const reader = new FileReader();
                    reader.addEventListener('load', (e) => {
                        const text = e.target.result;
                        if (text) {
                            // @ts-ignore  - it's a string
                            setRaw(text);
                        }
                    });
                    reader.readAsText(file);
                }
            }
        };

        const textareaEl = rawTextareaRef.current;
        if (textareaEl) {
            textareaEl.addEventListener('dragover', dragOverListener);
            textareaEl.addEventListener('dragenter', dragEnterListener);
            textareaEl.addEventListener('dragleave', dragLeaveListener);
            textareaEl.addEventListener('drop', dropListener);
            return () => {
                textareaEl.removeEventListener('dragover', dragOverListener);
                textareaEl.removeEventListener('dragenter', dragEnterListener);
                textareaEl.removeEventListener('dragleave', dragLeaveListener);
                textareaEl.removeEventListener('drop', dropListener);
            };
        }
    }, []);

    const handleChangeRaw = useCallback((e) => setRaw(e.target.value), []);

    const handleChooseFile = useCallback(async () => {
        try {
            const { file } =
                await window.electron.ipcRenderer.invoke('ipc-choose-file');
            // eslint-disable-next-line no-console
            console.log('ipc-choose-file:', file);
            setSourceMapFile(file);
        } catch (e) {
            toast({
                title: 'Failed sourcemap',
                description: 'Could not select a proper sourcemap file',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, []);

    const handleRun = useCallback(async () => {
        setRunning(true);
        try {
            const { result: convertedResult } =
                await window.electron.ipcRenderer.invoke('ipc-convert', raw);
            // eslint-disable-next-line no-console
            console.log('ipc-convert:', convertedResult);
            setResult(convertedResult);
        } catch (e) {
            toast({
                title: 'Failed convert',
                description: `Could not convert: ${e.message}`,
                status: 'error',
                duration: null, // no auto-close
                isClosable: true,
            });
        } finally {
            setRunning(false);
        }
    }, [raw]);

    return (
        <>
            {/* <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
        type="cookie"
      /> */}
            <ChakraProvider theme={theme}>
                {/*  <img width="200" alt="logo" src={icon} /> */}
                <VStack height="100%" padding={10} spacing={10}>
                    <HStack>
                        <Button onClick={handleChooseFile}>
                            {' '}
                            Load sourcemap file{' '}
                        </Button>
                        <Text fontSize="sm">
                            {sourceMapFile || 'No File Selected'}
                        </Text>
                    </HStack>
                    <HStack w="100%" spacing={10} flexGrow={1}>
                        <Textarea
                            ref={rawTextareaRef}
                            size="xs"
                            height="100%"
                            placeholder="Stack Trace extract. Can drop a file"
                            border={isDragOver ? 'solid 1px red' : undefined}
                            value={raw}
                            onChange={handleChangeRaw}
                        />

                        <Button
                            isLoading={isRunning}
                            isDisabled={!sourceMapFile || !raw}
                            onClick={handleRun}
                        >
                            Run
                        </Button>

                        <Textarea
                            size="xs"
                            height="100%"
                            isReadOnly
                            placeholder="Original source positions"
                            value={result}
                        />
                    </HStack>
                    isLoading{' '}
                </VStack>
            </ChakraProvider>
        </>
    );
}
