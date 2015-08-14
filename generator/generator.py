from __future__ import print_function
import json
import jsbeautifier


class Generator(object):

    def __init__(self, cinexplorer_model):
        self.model = cinexplorer_model

    def generate(self, func_gen_menu, current_menu=None):
        if not current_menu:
            current_menu = self.model.items()[0]  # first menu in hierarchy
        menu_name, menu_value = current_menu
        next_menu = menu_value['query']['results']['menuMatch']
        sparql = menu_value['query']['sparql']
        menu_funcs = func_gen_menu(menu_name, sparql, None)
        if 'categories' in menu_value:
            categories = menu_value['categories']
            for c in categories.items():
                menu_funcs += Generator.generate(self, func_gen_menu, c)
        return menu_funcs


class JSGenerator(Generator):

    def __init__(self, template, cinexplorer_model):
        self.template = template
        return super(JSGenerator, self).__init__(cinexplorer_model)

    def generate(self, beautify=True):
        code = self.template + \
            super(JSGenerator, self).generate(self.get_menu_func)
        if beautify:
            code = jsbeautifier.beautify(code)
        return code

    def get_menu_func(self, current_menu, query, next_menu):
        js_menu_funcs = ''
        if query:
            arg_template = "%%%"
            query_parametrized = '\"+arg+\"'.join(query.split(arg_template))
            arg_param = 'arg,' if arg_template in query else ''
            fun_template = 'function get_%s(%scallback){ query("%s", "json" , callback, alert); }\n'
            js_menu_funcs = fun_template % (
                current_menu, arg_param, query_parametrized)

        return js_menu_funcs


def main():
    with open('template.js') as template_file:
        with open('structure.json') as struct_file:
            with open('../opencin.js', 'w') as result_file:
                template = template_file.read()
                cinexplorer_model = json.load(struct_file)
                js_generator = JSGenerator(template, cinexplorer_model)
                js_code = js_generator.generate(beautify=True)
                result_file.write(js_code)


if __name__ == '__main__':
    main()
