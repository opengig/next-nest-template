'use client';
import { useModelSelectionStore } from '@/store/modelSelection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

interface ModelSelectorProps {
  className?: string;
}

const ModelSelector = ({ className }: ModelSelectorProps) => {
  const { selectedModel, availableModels, setSelectedModel } = useModelSelectionStore();

  const selectedModelInfo = availableModels.find((model) => model.id === selectedModel);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'anthropic':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'google':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className={className}>
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className='w-full border-none! bg-transparent!'>
          <SelectValue>
            <div className='flex items-center gap-2'>
              <Bot className='h-4 w-4' />
              <span>{selectedModelInfo?.name}</span>
              <Badge variant='outline' className={getProviderColor(selectedModelInfo?.provider || '')}>
                {selectedModelInfo?.provider}
              </Badge>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(
            availableModels.reduce(
              (acc, model) => {
                if (!acc[model.provider]) {
                  acc[model.provider] = [];
                }
                acc[model.provider].push(model);
                return acc;
              },
              {} as Record<string, typeof availableModels>
            )
          ).map(([provider, models]) => (
            <div key={provider}>
              <div className='text-muted-foreground px-2 py-1.5 text-sm font-semibold'>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </div>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className='flex items-center gap-2'>
                    <span>{model.name}</span>
                    <Badge variant='outline' className={getProviderColor(model.provider)}>
                      {model.provider}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
